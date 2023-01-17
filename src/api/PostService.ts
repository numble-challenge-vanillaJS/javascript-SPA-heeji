import axios from 'axios';
import { apiService } from '.';
import { CommentType, Post } from '../types/Post';

interface FetchPostListResponse {
  code: number;
  data: {
    posts: Post[];
  };
}

interface FetchPostDetailResponse {
  code: number;
  data: {
    post: Post;
    comments: CommentType[];
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image: string;
}

interface CreatePostResponse {
  code: number;
  data: {
    post: Post;
  };
}

// ****************************************************************************

export namespace PostService {
  /**
   * 글 목록을 불러옵니다.
   */
  export async function fetchPostList() {
    return apiService.get<FetchPostListResponse>('/posts').then(v => v.data);
  }

  /**
   * 랜덤 이미지 URL을 불러옵니다.
   */
  export async function getRandomImgURL() {
    return axios
      .get<any>(
        'https://api.unsplash.com/photos/random/?client_id=l0ZeFdhHf5DAMT2AQnvthVgTanhjEEhRUt5zBVx-voI'
      )
      .then(v => v.data);
  }

  /**
   * 글을 생성합니다.
   */
  export async function createPost(body: CreatePostRequest) {
    return apiService.post<CreatePostResponse>('/post', body).then(v => v.data);
  }

  /**
   * 글 상세 정보를 불러옵니다.
   */
  export async function fetchPost(postId: string) {
    return apiService
      .get<FetchPostDetailResponse>(`/post/${postId}`)
      .then(v => v.data);
  }

  /**
   * 글을 수정합니다.
   */
  export async function updatePost(
    postId: string,
    body: Partial<CreatePostRequest>
  ) {
    return apiService
      .patch<FetchPostDetailResponse>(`/post/${postId}`, body)
      .then(v => v.data);
  }

  /**
   * 글을 삭제합니다.
   */
  export async function deletePost(postId: string) {
    return apiService._delete(`/post/${postId}`).then(v => v.data);
  }

  /**
   * 댓글을 생성합니다.
   */
  export async function createComment(postId: string, content: string) {
    return apiService.post(`/comment/${postId}`, { content });
  }

  /**
   * 댓글을 삭제합니다.
   */
  export async function deleteComment(commentId: string) {
    return apiService._delete(`/comment/${commentId}`);
  }
}
