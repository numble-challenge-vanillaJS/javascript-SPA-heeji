import { PostService } from '../api/PostService';
import { PostDetail } from '../components/PostDetail';
import { Post } from '../types/Post';
import '../css/postDetail.css';
import { goBack } from '../router';

interface IPostDetailPage {
  state: Post;
  setState: (value: Post) => void;
  render: () => void;
}

interface IPostDetailPageConstructor {
  new ($parent: Element, postID: string): IPostDetailPage;
}

// ****************************************************************************

/**
 * 글 상세 페이지
 * @param postID
 */
export const PostDetailPage = function (
  this: IPostDetailPage,
  $parent: Element,
  postID: string
) {
  const $el = document.createElement('main');
  $el.className = 'PostDetailPage';

  this.setState = value => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    $el.innerHTML = `
      <nav class="title__container">
        <button class="back-button">⬅️</button>
        <h1 class="title">글 상세 페이지</h1>
      </nav>
    `;

    if (!this.state) {
      $el.innerHTML = '로딩중!';
    } else {
      new PostDetail($el, this.state);
      $parent.appendChild($el);
    }
  };

  const fetchPostDetail = async () => {
    const result = await PostService.fetchPost(postID);
    this.setState({ ...this.state, ...result.data.post });
  };

  fetchPostDetail();

  this.render();

  $el.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.className === 'back-button') {
      goBack();
    }
  });
} as unknown as IPostDetailPageConstructor;
