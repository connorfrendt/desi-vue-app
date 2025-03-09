<template>
    <section>
        
        <div class="sign-in-log-in" v-if="method === 'signin'">
            <form @submit.prevent="handleSignInSubmit(profile)">
                <div class="sign-in">
                    <h2>Sign In:</h2>
                        
                        <label>
                            Email:
                            <input v-model="profile.email" required>
                        </label>
                    
                        <label>
                            Password:
                            <input v-model="profile.password" type="password" required>
                        </label>
                        
                        <label>
                            <button>Sign In</button>
                        </label>
                </div>
                <p>
                    Need to register?
                    <button @click="method = 'signup'">Sign Up</button>
                </p>
            </form>
        </div>

        <div class="sign-in-log-in" v-else>
            <form @submit.prevent="handleSignUpSubmit(profile)">
                <div class="sign-in">
                    <h2>Sign Up:</h2>
                        <label>
                            Email:
                            <input v-model="profile.email" required>
                        </label>
                        
                        <label>
                            Password:
                            <input v-model="profile.password" type="password" required>
                        </label>
                        
                        <label>
                            <button>Sign Up</button>
                        </label>
                </div>
                <p>
                    Already have an account?
                    <button @click="method = 'signin'">Sign In</button>
                </p>
                
            </form>
        </div>

        <pre v-if="error">{{ error }}</pre>

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
                password: ''
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
                    passwordConfirm: this.profile.password
                });
                console.log(user);
            }
            catch(err) {
                console.error('ERROR: ', err);
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
    padding: 10px 0;
}

.sign-in-log-in {
    display: flex;
    justify-content: center;
    padding-top: 100px;
}

.sign-in {
    display: inline-block;
    border: 1px solid black;
    padding: 10px;
    background: rgb(230, 228, 228);
    box-shadow: 4px 4px 10px black;
    text-align: center;
}

pre {
    color: red;
}
</style>