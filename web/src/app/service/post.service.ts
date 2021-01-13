import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Post, PostUpdateResponseDTO } from '../post/post.models';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private POST_URL = environment['posts-url'];

  constructor(private http: HttpClient) { }

  public fetchPostCount(): Observable<number> {

    return this.http.get<number>(this.POST_URL,
      {
        params: {
          'justCount': ''
        }
      });
  }

  public fetchAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.POST_URL);
  }

  public fetchPosts(currentPage?: number, pageSize?: number): Observable<Post[]> {

    if (currentPage && pageSize) {
      return this.http.get<Post[]>(this.POST_URL, { params: { 'page': currentPage.toString(), 'pageSize': pageSize.toString() } });
    } else {
      return this.http.get<Post[]>(this.POST_URL);
    }
  }

  public createPost(post: Post) {
    return this.http.post<PostUpdateResponseDTO>(this.POST_URL, post);
  }

  public updatePost(post: Post) {
    return this.http.put<PostUpdateResponseDTO>(
      this.POST_URL.concat('/').concat(post._id || ''), post);
  }

  public deletePost(post: Post): Observable<PostUpdateResponseDTO> {
    return this.http.delete<PostUpdateResponseDTO>(this.POST_URL.concat('/').concat(post._id || ''));
  }
}
