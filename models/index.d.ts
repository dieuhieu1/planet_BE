import { Model, Sequelize, ModelStatic, Optional } from 'sequelize';

// --- Attributes Interfaces ---

export interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password?: string;
    refreshToken?: string;
    avatarUrl?: string;
    level: number;
    totalXp: number;
    isVerified: boolean;
    verificationToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LevelAttributes {
    level: number;
    minXp: number;
    rankName: string;
    iconUrl: string;
}

export interface PlanetAttributes {
    id: number;
    planetId: string;
    nameVi: string;
    nameEn: string;
    type: string;
    shortDescription: string;
    overview: string;
    image2d: string;
    model3d: string;
    hasAtmosphere: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MoonAttributes {
    id: number;
    planetId: number;
    name: string;
    diameterKm: number;
    description: string;
}

export interface GasAttributes {
    id: number;
    name: string;
}

export interface PlanetOrbitAttributes {
    planetId: number;
    axialTiltDeg: number;
    distanceFromSunKm: number;
    orbitalPeriodDays: number;
    rotationPeriodHours: number;
    orderFromSun: number;
}

export interface PlanetPhysicalAttributes {
    planetId: number;
    density: number;
    gravity: number;
    massKg: number;
    radiusKm: number;
    temperatureAvgC: number;
}

export interface PlanetAtmosphereAttributes {
    planetId: number;
    gasId: number;
    percentage: number;
}



export interface QuizAttributes {
    id: number;
    planetId: number;
    creatorId: number;
    title: string;
    description: string;
    rewardXp: number;
    minLevel: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface QuizAttemptAttributes {
    id: number;
    userId: number;
    quizId: number;
    score: number;
    xpEarned: number;
    currentIndex: number;
    startedAt: Date;
    finishedAt: Date;
}

export interface QuestionAttributes {
    id: number;
    quizId: number;
    content: string;
    mediaUrl: string;
}

export interface QuestionOptionAttributes {
    id: number;
    questionId: number;
    content: string;
    isCorrect: boolean;
}

export interface AttemptDetailAttributes {
    id: number;
    attemptId: number;
    questionId: number;
    selectedOptionId: number;
    isCorrect: boolean;
}

export interface UserFollowAttributes {
    followerId: number;
    followingId: number;
    createdAt?: Date;
}

export interface FileAttributes {
    id: number;
    filename: string;
    public_id: string;
    url: string;
    format: string;
    resource_type: string;
    details: any;
    createdAt?: Date;
    updatedAt?: Date;
}

// --- Creation Attributes (Optional fields for creation) ---
// For simplicity, we can use Optional<T, K> or just rely on Partial for creation in loose typing,
// but usually we define specific CreationAttributes. Here we'll stick to simple extentions.

export type UserCreationAttributes = Optional<UserAttributes, 'refreshToken' | 'avatarUrl' | 'createdAt' | 'updatedAt'>;
export type LevelCreationAttributes = LevelAttributes;
export type PlanetCreationAttributes = Optional<PlanetAttributes, 'createdAt' | 'updatedAt'>;
export type MoonCreationAttributes = MoonAttributes;
export type GasCreationAttributes = GasAttributes;
export type PlanetOrbitAttributesCreation = PlanetOrbitAttributes;
export type PlanetPhysicalAttributesCreation = PlanetPhysicalAttributes;
export type PlanetAtmosphereAttributesCreation = PlanetAtmosphereAttributes;

export type QuizCreationAttributes = Optional<QuizAttributes, 'createdAt' | 'updatedAt'>;
export type QuizAttemptCreationAttributes = QuizAttemptAttributes;
export type QuestionCreationAttributes = QuestionAttributes;
export type QuestionOptionCreationAttributes = QuestionOptionAttributes;
export type AttemptDetailCreationAttributes = AttemptDetailAttributes;
export type UserFollowCreationAttributes = Optional<UserFollowAttributes, 'createdAt'>;
export type FileCreationAttributes = Optional<FileAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// --- Model Classes ---

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public refreshToken?: string;
    public avatarUrl?: string;
    public level!: number;
    public totalXp!: number;
    public isVerified!: boolean;
    public verificationToken?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void;
}

export class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
    public level!: number;
    public minXp!: number;
    public rankName!: string;
    public iconUrl!: string;

    public static associate(models: any): void;
}

export class Planet extends Model<PlanetAttributes, PlanetCreationAttributes> implements PlanetAttributes {
    public id!: number;
    public planetId!: string;
    public nameVi!: string;
    public nameEn!: string;
    public type!: string;
    public shortDescription!: string;
    public overview!: string;
    public image2d!: string;
    public model3d!: string;
    public hasAtmosphere!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void;
}

export class Moon extends Model<MoonAttributes, MoonCreationAttributes> implements MoonAttributes {
    public id!: number;
    public planetId!: number;
    public name!: string;
    public diameterKm!: number;
    public description!: string;

    public static associate(models: any): void;
}

export class Gas extends Model<GasAttributes, GasCreationAttributes> implements GasAttributes {
    public id: number;
    public name!: string;
    public static associate(models: any): void;
}

export class PlanetOrbit extends Model<PlanetOrbitAttributes, PlanetOrbitAttributesCreation> implements PlanetOrbitAttributes {
    public planetId!: number;
    public axialTiltDeg!: number;
    public distanceFromSunKm!: number;
    public orbitalPeriodDays!: number;
    public rotationPeriodHours!: number;
    public orderFromSun!: number;

    public static associate(models: any): void;
}

export class PlanetPhysical extends Model<PlanetPhysicalAttributes, PlanetPhysicalAttributesCreation> implements PlanetPhysicalAttributes {
    public planetId!: number;
    public density!: number;
    public gravity!: number;
    public massKg!: number;
    public radiusKm!: number;
    public temperatureAvgC!: number;

    public static associate(models: any): void;
}

export class PlanetAtmosphere extends Model<PlanetAtmosphereAttributes, PlanetAtmosphereAttributesCreation> implements PlanetAtmosphereAttributes {
    public planetId!: number;
    public gasId!: number;
    public percentage!: number;

    public static associate(models: any): void;
}



export class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
    public id!: number;
    public planetId!: number;
    public creatorId!: number;
    public title!: string;
    public description!: string;
    public rewardXp!: number;
    public minLevel!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void;
}

export class QuizAttempt extends Model<QuizAttemptAttributes, QuizAttemptCreationAttributes> implements QuizAttemptAttributes {
    public id!: number;
    public userId!: number;
    public quizId!: number;
    public score!: number;
    public xpEarned!: number;
    public currentIndex!: number;
    public startedAt!: Date;
    public finishedAt!: Date;

    public static associate(models: any): void;
}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
    public id!: number;
    public quizId!: number;
    public content!: string;
    public mediaUrl!: string;

    public static associate(models: any): void;
}

export class QuestionOption extends Model<QuestionOptionAttributes, QuestionOptionCreationAttributes> implements QuestionOptionAttributes {
    public id!: number;
    public questionId!: number;
    public content!: string;
    public isCorrect!: boolean;

    public static associate(models: any): void;
}

export class AttemptDetail extends Model<AttemptDetailAttributes, AttemptDetailCreationAttributes> implements AttemptDetailAttributes {
    public id!: number;
    public attemptId!: number;
    public questionId!: number;
    public selectedOptionId!: number;
    public isCorrect!: boolean;

    public static associate(models: any): void;
}

export class UserFollow extends Model<UserFollowAttributes, UserFollowCreationAttributes> implements UserFollowAttributes {
    public followerId!: number;
    public followingId!: number;
    public readonly createdAt!: Date;

    public static associate(models: any): void;
}


export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
    public id!: number;
    public filename!: string;
    public public_id!: string;
    public url!: string;
    public format!: string;
    public resource_type!: string;
    public details: any;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void;
}


export interface Db {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    User: ModelStatic<User>;
    Level: ModelStatic<Level>;
    Planet: ModelStatic<Planet>;
    Moon: ModelStatic<Moon>;
    Gas: ModelStatic<Gas>;
    PlanetOrbit: ModelStatic<PlanetOrbit>;
    PlanetPhysical: ModelStatic<PlanetPhysical>;
    PlanetAtmosphere: ModelStatic<PlanetAtmosphere>;

    Quiz: ModelStatic<Quiz>;
    QuizAttempt: ModelStatic<QuizAttempt>;
    Question: ModelStatic<Question>;
    QuestionOption: ModelStatic<QuestionOption>;
    AttemptDetail: ModelStatic<AttemptDetail>;
    UserFollow: ModelStatic<UserFollow>;
    File: ModelStatic<File>;
}

declare const db: Db;
export = db;
