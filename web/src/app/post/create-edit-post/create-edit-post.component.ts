import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Post } from '../post.models';
import { OperationStatus } from '../../common/generic.models'

@Component({
  selector: 'app-create-edit-post',
  templateUrl: './create-edit-post.component.html',
  styleUrls: ['./create-edit-post.component.css']
})
export class CreateEditPostComponent implements OnInit {

  @Input('postToEdit') postToEdit?: Post;
  @Output('opStatusChange') opStatusEmitter = new EventEmitter<OperationStatus>();

  readonly badLanguage = ['hell', 'WTF'];

  postForm = new FormGroup({
    'title': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    'content': new FormControl(null, [Validators.required, this.validateLanguage.bind(this)])
  });

  submitAttempted = false;
  constructor(private postService: PostService, private router: Router) { }

  ngOnInit(): void {

    if (this.postToEdit) {
      this.postForm.setValue({ 'title': this.postToEdit.title, 'content': this.postToEdit.content });
    }
  }

  validateLanguage(control: FormControl): { [key: string]: boolean } | null {

    if (control.value && this.badLanguage.some((word) => (control.value as string).toLowerCase().split(' ').indexOf(word.toLowerCase()) >= 0)) {
      return { 'containsAbuse': true };
    }
    return null;
  }

  cancelUpdate() {

    this.opStatusEmitter.emit(OperationStatus.ABORTED);
  }

  submitForm() {

    if (this.postForm.invalid) {
      this.submitAttempted = true;
      return;
    }

    if (this.postToEdit) {

      this.postToEdit.title = this.postForm.get('title')?.value;
      this.postToEdit.content = this.postForm.get('content')?.value;

      this.postService.updatePost(this.postToEdit).subscribe(
        (response) => {
          if (response && response.success) {
            this.opStatusEmitter.emit(OperationStatus.COMPLETED);
          } else {
            alert('Post updation failed: '.concat(JSON.stringify(response.error)));
            this.opStatusEmitter.emit(OperationStatus.FAILED);
          }
        },
        (error) => {
          alert('Post updation failed: '.concat(JSON.stringify(error)));
          this.opStatusEmitter.emit(OperationStatus.FAILED);
        }
      );

    } else {
      let newPost: Post = {
        title: this.postForm.get('title')?.value,
        content: this.postForm.get('content')?.value
      };
      this.postService.createPost(newPost).subscribe(
        (response) => {
          if (response && response.success) {
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
}
