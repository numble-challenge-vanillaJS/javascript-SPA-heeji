import axios from 'axios';
import { apiService } from '.';
import { Post } from '../types/Post';

interface FetchPostListResponse {
  code: number;
  data: {
    posts: Post[];
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
}
