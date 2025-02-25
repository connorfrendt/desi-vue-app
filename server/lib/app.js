import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

const authData = await pb.collection("users").authWithPassword('test@example.com', '123456');

console.log(pb.authStore.isValid);
console.log(pb.authStore.token);
console.log(pb.authStore.record.id);