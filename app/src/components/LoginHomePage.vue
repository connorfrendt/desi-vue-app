<template>
    <section>
        
        <div class="sign-in-log-in" v-if="method === 'signin'">
            <form @submit.prevent="handleSignInSubmit(profile)">
                <div class="sign-in">
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                        <div class="input-element" style="text-align: right;">
                            EMAIL:
                        </div>
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input v-model="profile.email">
                        </div>
                    
                        <div class="input-element" style="text-align: right;">
                            PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input v-model="profile.password" type="password">
                        </div>

                        <div v-if="error" class="error-message">{{ error }}</div>
                        
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
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input v-model="profile.email">
                        </div>
                        
                        <div class="input-element" style="text-align: right;">
                            PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input v-model="profile.password" type="password" required>
                        </div>
                        
                        <div class="input-element" style="text-align: right;">
                            CONFIRM PASSWORD:
                        </div>
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input type="password" v-model="profile.passwordConfirm" required>
                        </div>
                        
                        <div class="input-element" style="text-align: right;">
                            NAME:
                        </div>
                        <div style="display: flex; align-items: center;" class="input-element">
                            <input type="text" v-model="profile.name" required>
                        </div>

                        <div v-if="error" class="error-message">{{ error }}</div>

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
                    
                </div>
                
            </form>
        </div>
        

    </section>
</template>

<script>
export default {
    data() {
        return {
            method: 'signin',
            error: '',
            profile: {
                email: '',
                password: '',
                passwordConfirm: '',
                name: ''
            },
        }
    },
    props: {
        onSignIn: Function,
        onSignUp: Function,
        pb: Object,
    },
    methods: {
        handleSignUpSubmit(profile) {
            this.onSignUp(profile)
                .then(() => {
                    this.$router.push('/phone-overview');
                })
                .catch(error => {
                    console.log('ERROR ERROR ERROR ERROR', error.data);
                    if(error.data.data.email) {
                        this.error = 'Invalid Email';
                    }
                    if(error.data.data.password) {
                        this.error = 'Password must be at least 8 characters long.';
                    }
                    if(error.data.data.passwordConfirm) {
                        this.error = 'Passwords do not match';
                    }
                });
        },
        handleSignInSubmit(profile) {
            this.onSignIn(profile)
                .then(() => {
                    // this.$router.push('/phone-overview');
                })
                .catch(error => {
                    console.log('Error: ', error.data);

                    this.error = 'Email or password is incorrect.';
                });
        }
    },
};
</script>

<style scoped>
label {
    display: block;
    padding: 100px 10px;
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
    text-align: center;
    height: 100vh;
    width: 30vw;
}

.input-element {
    padding: 50px 10px 10px 10px;
}

.error-message {
    background-color: rgba(255, 0, 0, 0.2);
    padding: 10px;
    display: flex;
    justify-content: center;
    grid-column: span 2;
}
</style>