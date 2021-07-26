import { Media } from "./media.model";

export interface Actor {
    adult: boolean,
    known_for: Media[]
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    popularity: number,
    profile_path: string
}