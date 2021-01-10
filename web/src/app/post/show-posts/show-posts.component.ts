import { Component, OnInit } from '@angular/core';
import { PostService } from './../../service/post.service';

import { Post, PostUpdateResponseDTO } from '../post.model';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.fetchPosts().subscribe((posts) => {
      this.posts = posts;
    },
      (error) => {
        console.log('Error Fetching Posts: ', error);
      })
  }

  deletePost(post: Post, index: number) {

    this.postService.deletePost(post).subscribe(
      (response: PostUpdateResponseDTO) => {
        if (!response.success) {
          alert('Could not delete post. HTTP Response!');
          console.log('Could not delete post. HTTP Response', response);
        } else {
          this.posts.splice(index, 1);
          alert('Post Has been Deleted!');
        }
      },
      (error) => {
        console.error('Error peforming post delete op. ', error);
      }
    );
  }

}
