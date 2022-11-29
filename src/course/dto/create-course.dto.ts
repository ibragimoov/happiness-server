export class CreateCourseDto {
    readonly title: string;
    readonly brief: string;
    readonly num_of_chapters: number;
    readonly fee: number;
    readonly chapters: any;
    // readonly chaptersTitle: any;
    // readonly chaptersBrief: any;
    // readonly chaptersContent: any;
    readonly user_id: number;
}
