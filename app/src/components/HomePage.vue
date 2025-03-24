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
                console.log('Restored Session: ', this.authData);
            }
        },
        async handleSignIn(userProfile) {
            this.authData = await this.pb.collection('customers').authWithPassword(
                userProfile.email,
                userProfile.password
            );
        },
        async handleSignUp(userProfile) {
            try {
                console.log('Trying');
                const user = await this.pb.collection('customers').create({
                    email: userProfile.email,
                    password: userProfile.password,
                    passwordConfirm: userProfile.passwordConfirm,
                    name: userProfile.name
                });
                setTimeout(() => {
                    console.log('Created User', user);
                }, 500);
                setTimeout(() => {
                    console.log('Logging in...');
                }, 500);

                this.authData = await this.pb.collection('customers').authWithPassword(
                    userProfile.email,
                    userProfile.password
                );
                console.log('Auth Data: ', this.authData);
                this.setUser(this.authData);
                setTimeout(() => {
                    console.log('Logged In!');
                }, 500);
                
            }
            catch(err) {
                console.error('ERROR DATA: ', err.data.data);
                this.error = 'Error in creating profile.  Please try again.';
                this.pb.authStore.clear();
                console.log('RETURN HERE??????');
                return;
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
        console.log('Mounting DB');
        this.startPocketBaseDB();
        console.log('HomePage PB: ', this.pb);
    }
}
</script>

<style>

</style>