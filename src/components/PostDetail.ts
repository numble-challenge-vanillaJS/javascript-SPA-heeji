import { PostService } from '../api/PostService';
import { navigate } from '../router';
import { Post, CommentType } from '../types/Post';
import { formatDate } from '../utils/dateUtil';
import '../css/postDetail.css';
import { $ } from '../utils/domUtil';

const postDetailHTML = (value: Data) => {
  return `
    <img 
      class="post__detail-img"
      src="${value.post.image}" 
      alt="${value.post.postId} image" 
      onError="this.src='https://img.freepik.com/premium-vector/magnifying-glass-404-isolated-white-background-vector-illustration_230920-1218.jpg?w=826';"
      
    />

    <section class="post__detail-container">
      <h3 class="post__detail-title">${value.post.title}</h3>
      <p class="post__detail-date">
        ${formatDate(new Date(value.post.createdAt))}
      </p>
      <p class="post__detail-content">${value.post.content}</p>
    </section>

    <div class="button-container">
      <button class="post__detail__edit-btn">수정하기</button>
      <button class="post__detail__delete-btn">삭제하기</button>
    </div>

    <section class="comment-section">
      <h3 class="comment-title">댓글창</h3>
      <ul>
        ${value.comments
          .map(
            v =>
              `<li class="comment-item" data-comment-id="${v.commentId}">
                <p>${v.content}</p>
                <button class="comment-delete-btn">🗑️</button>
              </li>`
          )
          .join('')}
      </ul>
    </section>

    <form class="comment-form">
      <input name="comment-input" class="comment-input" />
      <button class="comment-submit-btn">댓글 생성</button>
    </form>
  `;
};

// ****************************************************************************

interface Data {
  post: Post;
  comments: CommentType[];
}

interface IPostDetail {
  state: Data;
  eventHandler: (ev: MouseEvent) => void;
  setState: (value: Data) => void;
  render: () => void;
}

interface IPostDetailConstructor {
  new ($parent: Element, data: Data): IPostDetail;
}

// ****************************************************************************

/**
 * 글 상세 컴포넌트
 */
export const PostDetail = function (
  this: IPostDetail,
  $parent: Element,
  data: Data
) {
  const $postDetail = document.createElement('section');
  $postDetail.className = 'postDetail';

  this.state = {
    post: {
      title: '',
      content: '',
      image: '',
      postId: '',
      createdAt: '',
      updatedAt: '',
    },
    comments: [],
  };

  this.setState = (value: Data) => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    if (!this.state) {
      return;
    }

    $postDetail.innerHTML = '';
    $postDetail.innerHTML = postDetailHTML(this.state);

    $parent.appendChild($postDetail);
  };

  // 생성 시 호출
  this.setState(data);
  this.render();

  function deletePostFn(postId: string) {
    if (!confirm('정말 지우시겠습니까?')) {
      return;
    }

    (async () => {
      const result = await PostService.deletePost(postId);
      if (result) {
        navigate('/', null);
      }
    })();
  }

  this.eventHandler = (ev: MouseEvent) => {
    ev.preventDefault();
    const target = ev.target as HTMLElement;

    if (target.className === 'post__detail__edit-btn') {
      navigate('/edit-post', {
        detail: this.state.post,
      });
    }

    if (target.className === 'post__detail__delete-btn') {
      deletePostFn(this.state.post.postId);
    }

    if (target.className === 'comment-submit-btn') {
      const content = $('input[name="comment-input"]') as HTMLTextAreaElement;
      if (content.value.trim().length === 0) {
        return alert('댓글을 입력해주세요');
      }

      (async () => {
        await PostService.createComment(
          this.state.post.postId,
          content.value.trim()
        );
        const result = await PostService.fetchPost(this.state.post.postId);
        this.setState({ ...this.state, ...result.data });
      })();
    }

    if (target.className === 'comment-delete-btn') {
      if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
      }

      const target = ev?.target as HTMLElement;
      const $li = target.closest('li');

      const { commentId } = $li.dataset;

      if (commentId) {
        (async () => {
          await PostService.deleteComment(commentId);
          const result = await PostService.fetchPost(this.state.post.postId);
          this.setState({ ...this.state, ...result.data });
        })();
      }
    }
  };

  $postDetail.addEventListener('click', this.eventHandler);
} as unknown as IPostDetailConstructor;
