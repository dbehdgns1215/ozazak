export declare const getRecruitments: (params?: any) => Promise<{
    data: any[];
}>;
export declare const getRecruitmentDetail: (id: number | string) => Promise<{
    data: any;
}>;
export declare const addBookmark: (id: number) => Promise<any>;
export declare const deleteBookmark: (id: number) => Promise<any>;
export declare const getClosingRecruitments: () => Promise<{
    data: any[];
}>;
export declare const getBookmarkedRecruitments: (params?: any) => Promise<{
    data: any[];
}>;
