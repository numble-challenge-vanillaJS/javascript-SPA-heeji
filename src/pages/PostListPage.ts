import { PostService } from '../api/PostService';
import { PostList } from '../components/PostList';
import { navigate } from '../router';
import { Post } from '../types/Post';

interface IPostListPage {
  state: Post[];
  setState: (value: Post[]) => void;
  render: () => void;
}

interface IPostListPageConstructor {
  new ($parent: Element): IPostListPage;
}

// ****************************************************************************

/**
 * 글 목록 페이지
 */
export const PostListPage = function (this: IPostListPage, $parent: Element) {
  const $el = document.createElement('main');
  $el.className = 'PostListPage';
  $el.innerHTML = `
    <main>
      <h1>홈페이지</h1>
      <button class="post__create-btn">글 작성하기</button>
    </main>
  `;

  this.setState = (value: Post[]) => {
    this.state = value;
    this.render();
  };

  const fetchPostList = async () => {
    try {
      const result = await PostService.fetchPostList();
      this.setState(result.data.posts);
    } catch (err) {
      // TODO: 에러 경고 스낵바 추가
    }
  };

  fetchPostList();

  this.render = () => {
    new PostList($el, this.state);
    $parent.appendChild($el);
  };

  $el.addEventListener('click', (ev: MouseEvent) => {
    const target = ev?.target as HTMLElement;
    const isBtnClicked = target.className === 'post__create-btn';
    if (isBtnClicked) {
      navigate('/create-post', null);
    }
  });
} as unknown as IPostListPageConstructor;
