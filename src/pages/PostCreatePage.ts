import { CreatePostRequest, PostService } from '../api/PostService';
import { goBack, navigate } from '../router';
import { Post } from '../types/Post';
import { $ } from '../utils/domUtil';
import '../css/postCreate.css';

const postCreateHTML = (mode: ModeType, value: PostCreateState) => {
  const { post, isImageLoading } = value;

  return `
    <nav class="title__container">
      <button class="back-button">⬅️</button>
      <h1 class="title">${
        mode === 'create' ? '글 작성 페이지' : '글 수정 페이지'
      }</h1>
    </nav>

    ${
      post.image == ''
        ? `<button class="post__create-img-btn">
            ${isImageLoading ? '로딩중...' : '이미지 업로드'}
          </button>`
        : `<div class="image-container">
            <img class="post__uploaded-img-btn" src="${post?.image}" />
              <button class="refresh">새로고침</button>
          </div>`
    }

    <form class="post__create-form" action="submit" method="post">
      <label class="form-label">제목</label>
      <input
        type="text"
        name="post__input-title"
        placeholder="글 제목을 작성해주세요."
        maxLength="50"
        value="${post?.title ?? ''}"
      />
      <br />

      <label class="form-label">내용</label>
      <textarea
        type="text"
        name="post__textarea-content"
        placeholder="글 내용을 작성해주세요"
        maxLength="500"
      >${post?.content ?? ''}</textarea>
      <br />

      <button class="post__submit-btn">
        ${mode === 'create' ? '생성하기' : '수정하기'}
      </button>
    </form>
  `;
};

// ****************************************************************************

type ModeType = 'create' | 'edit';

type PostCreateState = {
  isImageLoading: boolean;
  post: CreatePostRequest;
};

interface IPostCreatePage {
  state: PostCreateState;
  setState: (value: Partial<PostCreateState>) => void;
  render: () => void;
}

interface IPostCreatePageConstructor {
  new ($parent: Element, mode: ModeType, post?: Post): IPostCreatePage;
}

// ****************************************************************************

/**
 * 글 작성 페이지
 */
export const PostCreatePage = function (
  this: IPostCreatePage,
  $parent: Element,
  mode: ModeType,
  post?: Post
) {
  const $el = document.createElement('main');
  $el.className = 'PostCreatePage';

  this.state = {
    isImageLoading: false,
    post: {
      image: post?.image ?? '',
      title: post?.title ?? '',
      content: post?.content ?? '',
    },
  };

  this.setState = value => {
    this.state = { ...this.state, ...value };
    this.render();
  };

  this.render = () => {
    $parent.innerHTML = '';
    $parent.appendChild($el);

    $el.innerHTML = postCreateHTML(mode, this.state);
  };

  this.render();

  $el.addEventListener('click', (ev: MouseEvent) => {
    const target = ev?.target as HTMLElement;
    const imgUploadBtnClicked = ['refresh', 'post__create-img-btn'].includes(
      target.className
    );

    if (imgUploadBtnClicked) {
      (async () => {
        try {
          this.setState({ isImageLoading: true });

          const result = await PostService.getRandomImgURL();

          if (result) {
            this.setState({
              post: { ...this.state.post, image: result.urls.regular },
            });
          }
        } catch (err) {
          alert('이미지를 생성하지 못했습니다.');
        } finally {
          this.setState({ isImageLoading: false });
        }
      })();
    }

    const backBtnClicked = target.classList.contains('back-button');
    if (backBtnClicked) {
      goBack();
    }
  });

  $el.addEventListener('submit', (ev: SubmitEvent) => {
    ev.preventDefault();

    const title = $('input[name="post__input-title"]') as HTMLInputElement;
    const content = $(
      'textarea[name="post__textarea-content"]'
    ) as HTMLTextAreaElement;

    if (this.state.post.image === '') {
      return alert('이미지를 업로드 해주세요');
    } else if (title.value.trim() === '') {
      return alert('제목을 입력해주세요');
    } else if (content.value.trim() === '') {
      return alert('내용을 입력해주세요');
    }

    (async () => {
      if (mode === 'create') {
        // 글을 생성합니다.
        try {
          const result = await PostService.createPost({
            image: this.state.post.image,
            title: title.value.trim(),
            content: content.value.trim(),
          });

          if (result) {
            navigate('/', null);
          }
        } catch (err) {
          alert('글을 생성하지 못했습니다.');
        }
      } else if (mode === 'edit') {
        // 글을 수정합니다.
        try {
          const result = await PostService.updatePost(post.postId, {
            image: this.state.post.image,
            title: title.value.trim(),
            content: content.value.trim(),
          });

          if (result) {
            goBack();
          }
        } catch (err) {
          alert('글을 수정하지 못했습니다.');
        }
      }
    })();
  });

  $el.addEventListener('change', (ev: Event) => {
    const title = $('input[name="post__input-title"]') as HTMLInputElement;
    const content = $(
      'textarea[name="post__textarea-content"]'
    ) as HTMLTextAreaElement;

    if (this.state.post.title !== title.value) {
      this.setState({ post: { ...this.state.post, title: title.value } });
    }
    if (this.state.post.content !== content.value) {
      this.setState({ post: { ...this.state.post, content: content.value } });
    }
  });
} as unknown as IPostCreatePageConstructor;
