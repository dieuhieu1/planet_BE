import { Model, Sequelize, ModelStatic, Optional } from 'sequelize';

// --- Attributes Interfaces ---

export interface UserAttributes {
    id: string;
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
    id: string;
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
    id: string;
    planetId: string;
    name: string;
    diameterKm: number;
    description: string;
}

export interface GasAttributes {
    id: string;
    name: string;
    chemicalFormula: string;
    colorHex: string;
}

export interface PlanetOrbitAttributes {
    planetId: string;
    axialTiltDeg: number;
    distanceFromSunKm: number;
    orbitalPeriodDays: number;
    rotationPeriodHours: number;
    orderFromSun: number;
}

export interface PlanetPhysicalAttributes {
    planetId: string;
    density: number;
    gravity: number;
    massKg: number;
    radiusKm: number;
    temperatureAvgC: number;
}

export interface PlanetAtmosphereAttributes {
    planetId: string;
    gasId: string;
    percentage: number;
}

export interface PlanetEventAttributes {
    id: string;
    planetId: string;
    eventDate: string; // DateOnly -> string or Date
    title: string;
    eventType: string;
    imageUrl: string;
}

export interface QuizAttributes {
    id: string;
    planetId: string;
    creatorId: string;
    title: string;
    description: string;
    rewardXp: number;
    minLevel: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface QuizAttemptAttributes {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    xpEarned: number;
    startedAt: Date;
    finishedAt: Date;
}

export interface QuestionAttributes {
    id: string;
    quizId: string;
    content: string;
    mediaUrl: string;
}

export interface QuestionOptionAttributes {
    id: string;
    questionId: string;
    content: string;
    isCorrect: boolean;
}

export interface AttemptDetailAttributes {
    id: string;
    attemptId: string;
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
}

export interface UserFollowAttributes {
    followerId: string;
    followingId: string;
    createdAt?: Date;
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
export type PlanetEventCreationAttributes = PlanetEventAttributes;
export type QuizCreationAttributes = Optional<QuizAttributes, 'createdAt' | 'updatedAt'>;
export type QuizAttemptCreationAttributes = QuizAttemptAttributes;
export type QuestionCreationAttributes = QuestionAttributes;
export type QuestionOptionCreationAttributes = QuestionOptionAttributes;
export type AttemptDetailCreationAttributes = AttemptDetailAttributes;
export type UserFollowCreationAttributes = Optional<UserFollowAttributes, 'createdAt'>;

// --- Model Classes ---

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
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
    public id!: string;
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
    public id!: string;
    public planetId!: string;
    public name!: string;
    public diameterKm!: number;
    public description!: string;

    public static associate(models: any): void;
}

export class Gas extends Model<GasAttributes, GasCreationAttributes> implements GasAttributes {
    public id!: string;
    public name!: string;
    public chemicalFormula!: string;
    public colorHex!: string;

    public static associate(models: any): void;
}

export class PlanetOrbit extends Model<PlanetOrbitAttributes, PlanetOrbitAttributesCreation> implements PlanetOrbitAttributes {
    public planetId!: string;
    public axialTiltDeg!: number;
    public distanceFromSunKm!: number;
    public orbitalPeriodDays!: number;
    public rotationPeriodHours!: number;
    public orderFromSun!: number;

    public static associate(models: any): void;
}

export class PlanetPhysical extends Model<PlanetPhysicalAttributes, PlanetPhysicalAttributesCreation> implements PlanetPhysicalAttributes {
    public planetId!: string;
    public density!: number;
    public gravity!: number;
    public massKg!: number;
    public radiusKm!: number;
    public temperatureAvgC!: number;

    public static associate(models: any): void;
}

export class PlanetAtmosphere extends Model<PlanetAtmosphereAttributes, PlanetAtmosphereAttributesCreation> implements PlanetAtmosphereAttributes {
    public planetId!: string;
    public gasId!: string;
    public percentage!: number;

    public static associate(models: any): void;
}

export class PlanetEvent extends Model<PlanetEventAttributes, PlanetEventCreationAttributes> implements PlanetEventAttributes {
    public id!: string;
    public planetId!: string;
    public eventDate!: string;
    public title!: string;
    public eventType!: string;
    public imageUrl!: string;

    public static associate(models: any): void;
}

export class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
    public id!: string;
    public planetId!: string;
    public creatorId!: string;
    public title!: string;
    public description!: string;
    public rewardXp!: number;
    public minLevel!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any): void;
}

export class QuizAttempt extends Model<QuizAttemptAttributes, QuizAttemptCreationAttributes> implements QuizAttemptAttributes {
    public id!: string;
    public userId!: string;
    public quizId!: string;
    public score!: number;
    public xpEarned!: number;
    public startedAt!: Date;
    public finishedAt!: Date;

    public static associate(models: any): void;
}

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
    public id!: string;
    public quizId!: string;
    public content!: string;
    public mediaUrl!: string;

    public static associate(models: any): void;
}

export class QuestionOption extends Model<QuestionOptionAttributes, QuestionOptionCreationAttributes> implements QuestionOptionAttributes {
    public id!: string;
    public questionId!: string;
    public content!: string;
    public isCorrect!: boolean;

    public static associate(models: any): void;
}

export class AttemptDetail extends Model<AttemptDetailAttributes, AttemptDetailCreationAttributes> implements AttemptDetailAttributes {
    public id!: string;
    public attemptId!: string;
    public questionId!: string;
    public selectedOptionId!: string;
    public isCorrect!: boolean;

    public static associate(models: any): void;
}

export class UserFollow extends Model<UserFollowAttributes, UserFollowCreationAttributes> implements UserFollowAttributes {
    public followerId!: string;
    public followingId!: string;
    public readonly createdAt!: Date;

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
    PlanetEvent: ModelStatic<PlanetEvent>;
    Quiz: ModelStatic<Quiz>;
    QuizAttempt: ModelStatic<QuizAttempt>;
    Question: ModelStatic<Question>;
    QuestionOption: ModelStatic<QuestionOption>;
    AttemptDetail: ModelStatic<AttemptDetail>;
    UserFollow: ModelStatic<UserFollow>;
}

declare const db: Db;
export = db;
