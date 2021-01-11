import { Component, OnInit } from '@angular/core';
import { PostService } from './../../service/post.service';

import { Post, PostUpdateResponseDTO } from '../post.models';
import { OperationStatus } from 'src/app/common/generic.models';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {

  posts: Post[] = [];
  postIndexToEdit = -1;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.fetchPosts().subscribe((posts) => {
      this.posts = posts;
    },
      (error) => {
        console.log('Error Fetching Posts: ', error);
      })
  }

  editPost(index: number) {
    this.postIndexToEdit = index;
  }

  onEditStatusChange(status: OperationStatus) {
    this.postIndexToEdit = -1;
  }

  deletePost(index: number) {

    this.postService.deletePost(this.posts[index]).subscribe(
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
