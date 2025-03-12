<template>
    <section>
        
        <div class="sign-in-log-in" v-if="method === 'signin'">
            <form @submit.prevent="handleSignInSubmit(profile)">
                <div class="sign-in">
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                        <div class="input-element" style="text-align: right;">
                            EMAIL:
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input v-model="profile.email">
                        </div>
                    
                        <div class="input-element" style="text-align: right;">
                            PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input v-model="profile.password" type="password">
                        </div>
                        
                        <div class="input-element" style="grid-column: 1 / span 2;">
                            <button>Log In</button>
                        </div>
                    </div>

                    <div style="border-top: 1px solid black;">
                        <div class="input-element">
                            Need to register?
                        </div>
                        <div class="input-element">
                            <button type="button" @click="method = 'signup'">Sign Up</button>
                        </div>
                    </div>
                </div>

            </form>
        </div>

        <div class="sign-in-log-in" v-else>
            <form @submit.prevent="handleSignUpSubmit(profile)">
                <div class="sign-in">
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                        <div class="input-element" style="text-align: right;">
                            EMAIL:
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input v-model="profile.email">
                        </div>
                        
                        <div class="input-element" style="text-align: right;">
                            PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input v-model="profile.password" type="password">
                        </div>
                        
                        <div class="input-element" style="text-align: right;">
                            CONFIRM PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input type="password" v-model="profile.passwordConfirm">
                        </div>

                        <div class="input-element" style="grid-column: 1 / span 2;">
                            <button>Sign Up</button>
                        </div>
                    </div>


                    <div style="border-top: 1px solid black;">
                        <div class="input-element">
                            Already have an account?
                        </div>
                        <div class="input-element">
                            <button type="button" @click="method = 'signin'">Log In</button>
                        </div>
                    </div>
                    <pre v-if="error">{{ error }}</pre>
                </div>
                
            </form>
        </div>
        

    </section>
</template>

<script>
import PocketBase from 'pocketbase';

export default {
    data() {
        return {
            method: 'signin',
            error: '',
            profile: {
                email: '',
                password: '',
                passwordConfirm: ''
            },
            pb: null
        };
    },
    props: {
        onSignIn: Function,
        onSignUp: Function
    },
    methods: {
        handleSignInSubmit() {
            
        },
        async handleSignUpSubmit() {
            
            try {
                const user = await this.pb.collection('users').create({
                    email: this.profile.email,
                    password: this.profile.password,
                    passwordConfirm: this.profile.passwordConfirm
                });
                console.log('User: ', user);
                console.log('record id: ', this.pb.authStore.record.id);
                await this.$nextTick();
                this.$router.push('/phone-overview');
                
            }
            catch(err) {
                console.error('ERROR: ', err);
                this.error = 'Passwords do not match.  Please try again.';
            }
        },
        startDB() {
            this.pb = new PocketBase('http://127.0.0.1:8090');
            console.log(this.pb);
        }
    },
    mounted() {
        console.log('Mounted');
        this.startDB();
    }
};
</script>

<style scoped>
label {
    display: block;
    padding: 10px;
}

.sign-in-log-in {
    display: flex;
    justify-content: flex-end;
}

.sign-in {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: rgb(230, 228, 228);
    /* background: white; */
    text-align: center;
    height: 100vh;
    width: 30vw;
}

.input-element {
    padding: 10px;
}

pre {
    color: red;
}
</style>