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

  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 0;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.fetchPostCount().subscribe(
      (postCount) => {
        this.totalPosts = postCount;
      },
      (error) => {
        console.log('Error Fetching Posts: ', error);
      }
    );

  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.posts = []
    this.postService.fetchPosts(this.currentPage, this.postsPerPage).subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.log('Error Fetching Posts: ', error);
      }
    );
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
          this.totalPosts--;
          this.onPageChange(this.currentPage);
        }
      },
      (error) => {
        console.error('Error peforming post delete op. ', error);
      }
    );
  }
}
