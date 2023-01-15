import { CreatePostRequest, PostService } from '../api/PostService';
import { navigate } from '../router';
import { $ } from '../utils/domUtil';

const postCreateHTML = (post: CreatePostRequest) => {
  return `
    <h1>글 작성 페이지</h1>

    <button class="post__create-img-btn">
      ${post?.image !== '' ? '이미지 업로드 완료' : '이미지 업로드'}
    </button>

    <form class="post__create-form" action="submit" method="post">
      <label>제목</label>
      <input
        type="text"
        name="post__input-title"
        placeholder="글 제목을 작성해주세요."
        maxLength="50"
      />
      <br />

      <label>내용</label>
      <textarea
        type="text"
        name="post__textarea-content"
        placeholder="글 내용을 작성해주세요"
        maxLength="500"
      ></textarea>
      <br />

      <button class="post__submit-btn">글 생성하기</button>
    </form>
  `;
};

interface IPostCreatePage {
  state: CreatePostRequest;
  setState: (value: Partial<CreatePostRequest>) => void;
  render: () => void;
}

interface IPostCreatePageConstructor {
  new ($parent: Element): IPostCreatePage;
}

// ****************************************************************************

/**
 * 글 작성 페이지
 */
export const PostCreatePage = function (
  this: IPostCreatePage,
  $parent: Element
) {
  const $el = document.createElement('main');
  $el.className = 'PostCreatePage';

  this.state = {
    image: '',
    title: '',
    content: '',
  };

  this.setState = value => {
    this.state = { ...this.state, ...value };
    this.render();
  };

  this.render = () => {
    $parent.innerHTML = '';
    $parent.appendChild($el);

    $el.innerHTML = postCreateHTML(this.state);
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
  });

  $el.addEventListener('submit', (ev: SubmitEvent) => {
    ev.preventDefault();

    const title = $('input[name="post__input-title"]') as HTMLInputElement;
    const content = $(
      'textarea[name="post__textarea-content"]'
    ) as HTMLTextAreaElement;

    if (title.value === '' || content.value === '' || this.state.image === '') {
      return alert('빈 칸을 입력해주세요.');
    }

    (async () => {
      const result = await PostService.createPost({
        image: this.state.image,
        title: title.value,
        content: content.value,
      });

      if (result) {
        navigate('/', null);
      }
    })();
  });
} as unknown as IPostCreatePageConstructor;
