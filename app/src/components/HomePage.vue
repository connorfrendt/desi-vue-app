<template>
    <div>
        <RouterView
            v-if="pb"
            :pb="pb"
            :onSignUp="handleSignUp"
            :onSignIn="handleSignIn"
            :onLogout="handleLogout"
            :user="user"
            :authData="authData"
        />
    </div>
</template>

<script>
import PocketBase from 'pocketbase';

export default {
    data() {
        return {
            pb: null,
            user: null,
            authData: null,
        }
    },
    methods: {
        startPocketBaseDB() {
            this.pb = new PocketBase('http://127.0.0.1:8090');
            
            // Check to see if user is already logged in
            if(this.pb.authStore.isValid) {
                this.authData = {
                    token: this.pb.authStore.token,
                    record: this.pb.authStore.model
                };
            }
        },
        async handleSignIn(userProfile) {
            try {
                this.authData = await this.pb.collection('customers').authWithPassword(
                    userProfile.email,
                    userProfile.password
                );
            }
            catch(err) {
                console.log('Error in login', err.data.data);
                this.error = 'Email or password does not exist.  Please try again.';
                throw err;
            }
        },
        async handleSignUp(userProfile) {
            try {
                const user = await this.pb.collection('customers').create({
                    email: userProfile.email,
                    password: userProfile.password,
                    passwordConfirm: userProfile.passwordConfirm,
                    name: userProfile.name
                });
                console.log(user); // keep this here for const user
                this.authData = await this.pb.collection('customers').authWithPassword(
                    userProfile.email,
                    userProfile.password
                );
                // console.log('Auth Data: ', this.authData);
                
                this.setUser(this.authData);
                console.log('Logged In!');
                
            }
            catch(err) {
                // console.log('HEEEEEEEEEERE IS THE ERROR', err.data);
                this.pb.authStore.clear();
                throw err;
            }
        },
        setUser(user) {
            this.user = user;
            if(user) {
                sessionStorage.setItem('user', JSON.stringify(user));
            }
        },
        handleLogout() {
            console.log('Logging out');
            sessionStorage.removeItem('user');
            this.user = null;
            this.$router.push('/login-page');
        }
    },
    mounted() {
        this.startPocketBaseDB();
    }
}
</script>

<style>

</style>