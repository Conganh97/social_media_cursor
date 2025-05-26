import { commentApi } from './commentApi';
import { likeApi } from './likeApi';
import { friendshipApi } from './friendshipApi';

class SocialApiService {
  get comments() {
    return commentApi;
  }

  get likes() {
    return likeApi;
  }

  get friendships() {
    return friendshipApi;
  }
}

export const socialApi = new SocialApiService(); 