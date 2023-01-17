import { PostService } from '../api/PostService';
import { navigate } from '../router';
import { Post } from '../types/Post';
import { formatDate } from '../utils/dateUtil';
import '../css/postDetail.css';

interface IPostDetail {
  state: Post;
  eventHandler: (ev: MouseEvent) => void;
  setState: (value: Post) => void;
  render: () => void;
}

interface IPostDetailConstructor {
  new ($parent: Element, post: Post): IPostDetail;
}

// ****************************************************************************

/**
 * 글 상세 컴포넌트
 */
export const PostDetail = function (
  this: IPostDetail,
  $parent: Element,
  post: Post
) {
  const $postDetail = document.createElement('section');

  this.state = {
    title: '',
    content: '',
    image: '',
    postId: '',
    createdAt: '',
    updatedAt: '',
  };

  this.setState = (value: Post) => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    if (!this.state) {
      return;
    }

    $postDetail.innerHTML = '';
    $postDetail.innerHTML = `
      <img 
        class="post__detail-img"
        src="${post.image}" 
        alt="${post.postId} image" 
        onError="this.src='https://img.freepik.com/premium-vector/magnifying-glass-404-isolated-white-background-vector-illustration_230920-1218.jpg?w=826';"
        
      />
      <section class="post__detail-container">
        <h3 class="post__detail-title">${post.title}</h3>
        <p class="post__detail-date">${formatDate(new Date(post.createdAt))}</p>
        <p class="post__detail-content">${post.content}</p>
      </section>

      <div class="button-container">
        <button class="post__detail__edit-btn">수정하기</button>
        <button class="post__detail__delete-btn">삭제하기</button>
      </div>
    `;

    $parent.appendChild($postDetail);
  };

  this.render();

  this.eventHandler = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;

    if (target.className === 'post__detail__edit-btn') {
      navigate('/edit-post', {
        detail: post,
      });
    }

    if (target.className === 'post__detail__delete-btn') {
      if (!confirm('정말 지우시겠습니까?')) {
        return;
      }

      (async () => {
        const result = await PostService.deletePost(post.postId);
        if (result) {
          navigate('/', null);
        }
      })();
    }
  };

  $postDetail.addEventListener('click', this.eventHandler);
} as unknown as IPostDetailConstructor;
