<template>
    <section>
        <div>
            <a href="https://labels.desi.com/" target="_blank">
                <img class="desi-logo" src="../assets/desi-logo.png" />
            </a>
        </div>

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
                            <button class="sign-in-log-in-button">Log In</button>
                        </div>
                    </div>
                    
                    <div style="border-top: 2px solid #1b255f; margin: 0 10px;">
                        <div class="input-element">
                            Need to register?
                        </div>
                        <div class="input-element">
                            <button class="sign-in-log-in-button" type="button" @click="method = 'signup'">Sign Up</button>
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


                    <div style="border-top: 2px solid #1b255f; margin: 0 10px;">
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
                    this.$router.push('/phone-overview');
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
.desi-logo {
    cursor: pointer;
    height: 55px;
    padding: 10px;
}

.sign-in-log-in {
    /* background-color: white; */
    margin: 50px 20px 20px 20px;
}

.sign-in {
    background: rgb(223, 223, 223);
    margin: 0 200px 0 200px;
    text-align: center;
    border: 3px solid #1b255f;
    border-radius: 5px;
}

.input-element {
    padding: 50px 10px 10px 10px;
}

.sign-in-log-in-button {
    all: unset;
    cursor: pointer;
    background-color: white;
    border: 2px solid rgba(27, 37, 95, 1);
    border-radius: 5px;
    padding: 10px;
}

.sign-in-log-in-button:hover {
    background-color: rgba(27, 37, 95, 0.5);
    color: white;
}

.sign-in-log-in-button:active {
    background-color: rgba(27, 37, 95, 1);
    color: white;
}

.error-message {
    background-color: rgba(255, 0, 0, 0.2);
    padding: 10px;
    display: flex;
    justify-content: center;
    grid-column: span 2;
}
</style>