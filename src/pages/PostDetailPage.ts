import { PostService } from '../api/PostService';
import { PostDetail } from '../components/PostDetail';
import { Post } from '../types/Post';

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
    $el.innerHTML = '<h1>글 상세 페이지</h1>';

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
} as unknown as IPostDetailPageConstructor;
