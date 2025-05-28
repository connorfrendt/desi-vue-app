<template>
    <section class="desi-picture">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); padding: 0 100px;">

            <div>
                <div class="desi-welcome">
                    <div style="text-align: center;">
                        <a href="https://labels.desi.com/" target="_blank">
                            <img class="desi-logo" src="../assets/desi-logo.png" />
                        </a>
                    </div>
        
                    <div class="welcome"><b>Welcome!</b></div>
    
                </div>
            </div>
        
            <div style="height: 100vh; padding: 0 30px;">
                <div class="sign-in-log-in" v-if="method === 'signin'">
                    <form @submit.prevent="handleSignInSubmit(profile)">
                        <div class="sign-in">
                            <div class="elements">
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" v-model="profile.email" placeholder="Email">
                                </div>
                            
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" type="password" v-model="profile.password" placeholder="Password">
                                </div>
        
                                <div v-if="error" class="error-message">{{ error }}</div>
                                
                                <div class="input-element" style="grid-column: 1 / span 2;">
                                    <button class="sign-in-log-in-button">Log In</button>
                                </div>
                            </div>
                            
                            <div class="register">
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
                            <div class="elements">
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" v-model="profile.email" placeholder="Email">
                                </div>
                                
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" type="password" v-model="profile.password" placeholder="Password" required>
                                </div>
                                
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" type="password" v-model="profile.passwordConfirm" placeholder="Confirm Password" required>
                                </div>
                                
                                <div style="display: flex; align-items: center;" class="input-element">
                                    <input class="input-field" type="text" v-model="profile.name" placeholder="Name" required>
                                </div>
        
                                <div v-if="error" class="error-message">{{ error }}</div>
        
                                <div class="input-element" style="grid-column: 1 / span 2;">
                                    <button class="sign-in-log-in-button">Sign Up</button>
                                </div>
                            </div>
        
        
                            <div class="register">
                                <div class="input-element">
                                    Already have an account?
                                </div>
                                <div class="input-element">
                                    <button class="sign-in-log-in-button" type="button" @click="method = 'signin'">Go to Sign In</button>
                                </div>
                            </div>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
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
    watch: {
        'profile.email'() {
            if (this.error) this.error = '';
        },
        'profile.password'() {
            if (this.error) this.error = '';
        },
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

.desi-logo {
    cursor: pointer;
    height: 55px;
    padding: 100px 10px 10px 10px;
}   

.sign-in-log-in {
    /* margin: 50px 20px 20px 20px; */
    /* background-image: url('../assets/blue_tech_bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat; */
}

.sign-in {
    text-align: center;
    height: 90vh;
    margin: 50px;
    background-color: #b2dcfc;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.welcome {
    text-align: center;
    padding-top: 100px;
    font-size: 50px;
    color: #1b255f;
}

.roboto-welcome {
  font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}

.elements {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 120px;
}

.desi-welcome {
    height: 100vh;
}

.desi-picture {
    background-image: url('../assets/light_blue_bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.desi-picture {
    /* background-image: url('../assets/blue_tech_bg.jpg'); */
    /* background-size: cover;
    background-position: center;
    background-repeat: no-repeat; */
}

.input-element {
    padding: 50px 10px 10px 10px;
}

.input-field {
    padding: 15px;
    border-radius: 5px;
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

.register {
    border-top: 2px solid #1b255f;
    margin: 20px;
}
</style>