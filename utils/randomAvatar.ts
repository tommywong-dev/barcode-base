import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator();

// Simply get a random avatar
export const getRandomAvatar = (uid: string) => {
  return generator.generateRandomAvatar(uid);
};
