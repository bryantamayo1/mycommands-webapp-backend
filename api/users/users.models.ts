import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { userRoles } from "../utils/constants";

// any to avoid type method checkPassword
const UsersSchema = new Schema<any>({
    userName: { 
        type: String,
        required: [true, "UserName is compulsory"],
        trim: true
    },
    email: {                // PRIMARY KEY UNIQUE
        type: String,
        required: [true, "Email is compulsory"],
        unique: true,
        trim: true,
        validate: {
            validator: function(email: string){
                return /^\S+@\S+\.\S+$/.test(email);
            },
            message: (props: any) => `${props.value} isn't a right email`
        }
    },
    password: {
        type: String,
        required: [true, "Password is compulsory"],
        minLength: [8, "Password must have more 7 characters"],
        select: false
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.USER, userRoles.GUEST],
        default: "user"
    }
}, {
    timestamps: true
});

// Middlewares
UsersSchema.pre('save', async function(next: any) {
    // Save password
    this.password = await bcrypt.hash(this.password, +process.env.SALT_BCRYPTJS!);
    next();
});

// Methods
/**
 * Check passwoord of FE with password of BE
 * @param passwordToCheck 
 * @param passwordInBe 
 * @returns Promise with true or false if callback has been omited
 */
 UsersSchema.methods.checkPassword = async function(passwordToCheck: string, passwordInBe: string){
    return await bcrypt.compare(passwordToCheck, passwordInBe);
}

UsersSchema.methods.toJSON = function(){
    const {__v, ...user} = this.toObject();
    return user;
}

const UsersModel = model("user", UsersSchema); 
export {UsersModel}