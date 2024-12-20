<template>
    <section>
        
        <div v-if="method === 'signin'">
            <form @submit.prevent="handleSignInSubmit(profile)">
                <div class="sign-in">
                    <h2>Sign In:</h2>
                        
                        <label>
                            Username:
                            <input v-model="profile.username" required>
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

        <div v-else>
            <form @submit.prevent="handleSignUpSubmit(profile)">
                <div class="sign-in">
                    <h2>Sign Up:</h2>
                        <label>
                            Username:
                            <input v-model="profile.username" required>
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
export default {
    data() {
        return {
            method: 'signin',
            error: '',
            profile: {
                username: '',
                password: ''
            }
        };
    },
    props: {
        onSignIn: Function,
        onSignUp: Function
    },
    methods: {
        handleSignInSubmit() {
            this.error = '';
            
            this.onSignIn(this.profile)
                .then(() => {
                    this.$router.push('/NeedsWants');
                })
                .catch(error => {
                    this.error = error.error;
                });
        },

        handleSignUpSubmit() {
            this.error = '';
            
            this.onSignUp(this.profile)
                .then(() => {
                    this.$router.push('/NeedsWants');
                })
                .catch(error => {
                    this.error = error.error;
                });
        }
        
    }
};
</script>

<style scoped>
label {
    display: block;
    padding: 10px 0;
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