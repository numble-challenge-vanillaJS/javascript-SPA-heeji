import { CreatePostRequest, PostService } from '../api/PostService';
import { goBack, navigate } from '../router';
import { Post } from '../types/Post';
import { $ } from '../utils/domUtil';
import '../css/postCreate.css';

type ModeType = 'create' | 'edit';

const postCreateHTML = (mode: ModeType, post: CreatePostRequest) => {
  return `
    <nav class="title__container">
      <button class="back-button">⬅️</button>
      <h1 class="title">${
        mode === 'create' ? '글 작성 페이지' : '글 수정 페이지'
      }</h1>
    </nav>

    <button class="post__create-img-btn">
      ${post?.image !== '' ? '이미지 업로드 완료' : '이미지 업로드'}
    </button>

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

interface IPostCreatePage {
  state: CreatePostRequest;
  setState: (value: Partial<CreatePostRequest>) => void;
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
    image: post?.image ?? '',
    title: post?.title ?? '',
    content: post?.content ?? '',
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

    const imgUploadBtnClicked = target.className === 'post__create-img-btn';
    if (imgUploadBtnClicked) {
      (async () => {
        const result = await PostService.getRandomImgURL();

        if (result) {
          this.setState({ image: result.urls.regular });
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

    if (
      title.value.trim() === '' ||
      content.value.trim() === '' ||
      this.state.image === ''
    ) {
      return alert('빈 칸을 입력해주세요.');
    }

    (async () => {
      if (mode === 'create') {
        // 글을 생성합니다.
        const result = await PostService.createPost({
          image: this.state.image,
          title: title.value.trim(),
          content: content.value.trim(),
        });

        if (result) {
          navigate('/', null);
        }
      } else if (mode === 'edit') {
        // 글을 수정합니다.
        const result = await PostService.updatePost(post.postId, {
          image: this.state.image,
          title: title.value.trim(),
          content: content.value.trim(),
        });

        if (result) {
          goBack();
        }
      }
    })();
  });
} as unknown as IPostCreatePageConstructor;
