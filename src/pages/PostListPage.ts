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

  this.render();

  $el.addEventListener('click', (ev: MouseEvent) => {
    const target = ev?.target as HTMLElement;
    const $li = target.closest('li');

    const { postId } = $li.dataset;

    if (postId) {
      navigate(`/post/${postId}`, null);
    }
  });
} as unknown as IPostListPageConstructor;
