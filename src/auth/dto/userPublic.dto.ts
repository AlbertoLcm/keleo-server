export class UserPublicDto {
  id: string;
  name: string;
  lastname: string | null;
  email: string;
  role: string;
  profile_image: string | null;
  created_at: Date | null;
}
