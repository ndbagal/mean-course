import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription = new Subscription();

  constructor(public postsService: PostsService) {}

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
