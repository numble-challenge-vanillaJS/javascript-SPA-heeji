import { apiService } from '.';
import { Post } from '../types/Post';

interface FetchPostListResponse {
  code: number;
  data: {
    posts: Post[];
  };
}

export namespace PostService {
  /**
   * 글 목록을 불러옵니다.
   */
  export async function fetchPostList() {
    return apiService.get<FetchPostListResponse>('/posts').then(v => v.data);
  }
}
