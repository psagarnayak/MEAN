import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Post, PostUpdateResponseDTO } from '../post/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private POST_URL = environment['posts-url'];

  constructor(private http: HttpClient) { }

  public fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.POST_URL);
  }

  public createPost(post: Post) {
    return this.http.post<PostUpdateResponseDTO>(this.POST_URL, post);
  }

  public deletePost(post: Post): Observable<PostUpdateResponseDTO> {
    return this.http.delete<PostUpdateResponseDTO>(this.POST_URL.concat('/').concat(post._id || ''));
  }
}
