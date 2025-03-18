<template>
    <div>
        <RouterView
            :pb="pb"
            :onSignUp="handleSignUp"
            :onSignIn="handleSignIn"
            :onLogout="handleLogout"
            :user="user"
        />
    </div>
</template>

<script>
import PocketBase from 'pocketbase';

export default {
    data() {
        return {
            pb: null
        }
    },
    methods: {
        startPocketBaseDB() {
            this.pb = new PocketBase('http://127.0.0.1:8090');
            console.log('PocketBase: ', this.pb, typeof this.pb);
        },
        handleSignIn() {
            
        },
        async handleSignUp(userProfile) {
            console.log('User Profile: ', userProfile);
            try {
                console.log('Trying');
                const user = await this.pb.collection('users').create({
                    email: userProfile.email,
                    password: userProfile.password,
                    passwordConfirm: userProfile.passwordConfirm,
                    name: userProfile.name
                });

                this.setUser(user);
                
            }
            catch(err) {
                console.error('ERROR: ', err);
                this.error = 'Error in creating profile.  Please try again.';
            }
        },
        setUser(user) {
            this.user = user;
            if(user) {
                console.log('THIS IS THE USER: ', user);
                sessionStorage.setItem('user', JSON.stringify(user));
                console.log('User: ', user);
            }
        },
        handleLogout() {
            console.log('Logging out');
            sessionStorage.removeItem('user');
            this.user = null;
            this.$router.push('/');
        }
    },
    mounted() {
        console.log('Mounting DB');
        this.startPocketBaseDB();
    }
}
</script>

<style>

</style>