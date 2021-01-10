import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  badLanguage = ['hell', 'WTF'];

  postForm = new FormGroup({
    'title': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    'content': new FormControl(null, [Validators.required, this.validateLanguage.bind(this)])
  });

  submitAttempted = false;
  constructor(private postService: PostService, private router: Router) { }

  ngOnInit(): void { }

  validateLanguage(control: FormControl): { [key: string]: boolean } | null {

    console.log(control.value);
    if (control.value && this.badLanguage.some((word) => (control.value as string).toLowerCase().split(' ').indexOf(word.toLowerCase()) >= 0)) {
      return { 'containsAbuse': true };
    }
    return null;
  }

  submitForm() {

    if (this.postForm.invalid) {
      this.submitAttempted = true;
      return;
    }

    let newPost: Post = {
      title: this.postForm.get('title')?.value,
      content: this.postForm.get('content')?.value
    };
    this.postService.createPost(newPost).subscribe(
      (response) => {
        if (response && response.success) {
          alert('Post Created Successfully!');
          this.router.navigate(['/']);
        } else {
          alert('Post Creation failed: '.concat(JSON.stringify(response.error)));
        }
      },
      (error) => {
        alert('Post Creation failed: '.concat(JSON.stringify(error)));
      }
    );
  }
}
