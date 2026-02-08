import client from './client';

// --- Type Definitions ---
export type UserProfile = {
    accountId: number;
    email: string;
    name: string;  // API returns 'name', not 'nickname'
    nickname?: string;  // Optional for backward compatibility
    bio?: string;
    role: string;
    img: string;  // API returns 'img', not 'profileImage'
    profileImage?: string;  // Optional for backward compatibility
    createdAt: string;
    followerCount: number;  // API returns 'followerCount', not 'followersCount'
    followeeCount: number;  // API returns 'followeeCount', not 'followingsCount'
    followersCount?: number;  // Optional for backward compatibility
    followingsCount?: number;  // Optional for backward compatibility
};

export type UserStreak = {
    date: string;
    value: number;  // Backend returns 'value', not 'count'
};

export type StreakData = {
    currentStreak: number;
    longestStreak: number;
};

export type StreakResponse = {
    data: UserStreak[];
    streakData: StreakData;
};

export type UserRecord = {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    organization: string;
};

export type UserAward = {
    id: number;
    title: string;
    rankName: string;
    organization: string;
    awardedAt: string;
};

export type UserCertification = {
    id: number;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
};

export type Follower = {
    id: number;
    nickname: string;
    profileImage: string;
    isFollowing?: boolean;
};

export type Followee = {
    id: number;
    nickname: string;
    profileImage: string;
    isFollowing?: boolean;
};

// --- User Profile ---
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
    const response = await client.get(`/users/${userId}`);
    // Backend returns { message, data } structure
    return response.data.data || response.data;
};

export const updateUserProfile = async (userId: number, data: Partial<UserProfile>) => {
    const response = await client.put(`/users/${userId}`, data);
    return response.data;
};

export const withdrawUser = async (userId: number) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
};

// --- Streak ---
export const getUserStreak = async (userId: number, date?: string): Promise<any> => {
    const response = await client.get(`/users/${userId}/streak`, {
        params: { date }
    });
    // Backend returns { message, data: [...], streakData: {...} }
    return response.data;
};

// --- Records (이력 관리) ---
export const getUserRecords = async (userId: number): Promise<any> => {
    const response = await client.get(`/users/${userId}/records`);
    // Backend returns { message, data: { userId, resumes: [...] } }
    const resumes = response.data?.data?.resumes || response.data?.resumes || [];

    // Map backend 'Resume' -> frontend 'Record'
    return Array.isArray(resumes) ? resumes.map((resume: any) => {
        // Content parsing: "[소속: Org]\nDesc" -> organization, description
        let organization = '';
        let description = resume.content || '';

        const orgMatch = description.match(/^\[소속: (.*?)\]\n([\s\S]*)/);
        if (orgMatch) {
            organization = orgMatch[1];
            description = orgMatch[2];
        } else if (description.startsWith('[소속: ')) {
            const closeIndex = description.indexOf(']');
            if (closeIndex > -1) {
                organization = description.substring(5, closeIndex);
                description = description.substring(closeIndex + 1).trim(); // +1 to skip ']' and trim newline
            }
        }

        return {
            id: resume.resumeId || resume.id,
            title: resume.title,
            description: description,
            startDate: resume.startedAt ? resume.startedAt.substring(0, 7) : '', // YYYY-MM-DD -> YYYY-MM
            endDate: resume.endedAt ? resume.endedAt.substring(0, 7) : '',
            organization: organization
        };
    }).sort((a: any, b: any) => a.startDate.localeCompare(b.startDate)) : [];
};

export const createUserRecord = async (userId: number, recordData: Omit<UserRecord, 'id'>) => {
    // Map Frontend 'Record' -> Backend 'Resume'
    // Frontend uses YYYY-MM for startDate/endDate, Backend LocalDate needs YYYY-MM-DD
    const formatDate = (date: string) => date ? `${date}-01` : null;

    const contentWithOrg = [
        recordData.organization ? `[소속: ${recordData.organization}]` : '',
        recordData.description
    ].filter(Boolean).join('\n');

    const payload = {
        title: recordData.title,
        content: contentWithOrg || '내용 없음', // Content is @NotBlank
        startedAt: formatDate(recordData.startDate),
        endedAt: formatDate(recordData.endDate)
    };
    const response = await client.post(`/users/${userId}/records`, payload);
    return response.data;
};

export const updateUserRecord = async (userId: number, recordId: number, recordData: Partial<UserRecord>) => {
    const formatDate = (date: string) => date ? `${date}-01` : null;
    const payload: any = {};

    if (recordData.title) payload.title = recordData.title;

    // For update, reconstruct content if possible
    const contentParts = [];
    if (recordData.organization) contentParts.push(`[소속: ${recordData.organization}]`);
    if (recordData.description) contentParts.push(recordData.description);

    if (contentParts.length > 0) {
        payload.content = contentParts.join('\n');
    }

    if (recordData.startDate) payload.startedAt = formatDate(recordData.startDate);
    if (recordData.endDate) payload.endedAt = formatDate(recordData.endDate);

    const response = await client.put(`/users/${userId}/records/${recordId}`, payload);
    return response.data;
};

export const deleteUserRecord = async (userId: number, recordId: number) => {
    const response = await client.delete(`/users/${userId}/records/${recordId}`);
    return response.data;
};

export const getUserAwards = async (userId: number): Promise<any> => {
    const response = await client.get(`/users/${userId}/awards`);
    // Return raw response - let MyPage.tsx handle the mapping
    return response.data;
};

export const createUserAward = async (userId: number, awardData: Omit<UserAward, 'id'>) => {
    // Frontend sends: title, rankName, organization, awardedAt
    // Backend expects: title, rankName, organization, awardedAt
    const payload = {
        title: awardData.title,
        rankName: awardData.rankName || '',
        organization: awardData.organization || '',
        awardedAt: awardData.awardedAt
    };
    const response = await client.post(`/users/${userId}/awards`, payload);
    return response.data;
};

export const updateUserAward = async (userId: number, awardId: number, awardData: Partial<UserAward>) => {
    // Frontend sends: title, rankName, organization, awardedAt
    // Backend expects: title, rankName, organization, awardedAt
    const payload: any = {};
    if (awardData.title) payload.title = awardData.title;
    if (awardData.rankName !== undefined) payload.rankName = awardData.rankName;
    if (awardData.organization !== undefined) payload.organization = awardData.organization;
    if (awardData.awardedAt) payload.awardedAt = awardData.awardedAt;

    const response = await client.put(`/users/${userId}/awards/${awardId}`, payload);
    return response.data;
};

export const deleteUserAward = async (userId: number, awardId: number) => {
    const response = await client.delete(`/users/${userId}/awards/${awardId}`);
    return response.data;
};

// --- Certifications (자격증) ---
export const getUserCertifications = async (userId: number): Promise<any> => {
    const response = await client.get(`/users/${userId}/certification`);
    const certificates = response.data?.data?.certificates || response.data?.certificates || response.data || [];

    // Map backend fields to frontend types
    return Array.isArray(certificates) ? certificates.map((item: any) => ({
        id: item.certificateId || item.id,
        name: item.title || item.name,
        issuingOrganization: item.organization || item.issuingOrganization,
        issueDate: item.awardedAt || item.issueDate,
        expirationDate: item.expirationDate || ''
    })) : [];
};

export const createUserCertification = async (userId: number, certData: Omit<UserCertification, 'id'>) => {
    // Map frontend fields to backend DTO
    // Frontend: name, issuingOrganization, issueDate
    // Backend: title, organization, awardedAt
    const payload = {
        title: certData.name,
        organization: certData.issuingOrganization,
        awardedAt: certData.issueDate,
        rankName: ''
    };
    const response = await client.post(`/users/${userId}/certification`, payload);
    return response.data;
};

export const updateUserCertification = async (userId: number, certId: number, certData: Partial<UserCertification>) => {
    const payload: any = {};
    if (certData.name) payload.title = certData.name;
    if (certData.issuingOrganization) payload.organization = certData.issuingOrganization;
    if (certData.issueDate) payload.awardedAt = certData.issueDate;

    const response = await client.put(`/users/${userId}/certification/${certId}`, payload);
    return response.data;
};

export const deleteUserCertification = async (userId: number, certId: number) => {
    const response = await client.delete(`/users/${userId}/certification/${certId}`);
    return response.data;
};

// --- Followers/Followees (팔로워/팔로잉) ---
export const getFollowers = async (userId: number): Promise<Follower[]> => {
    const response = await client.get(`/users/${userId}/follower`); // Reverted to singular
    // Backend returns { message, data: { userId, followers: [...] } }
    const followers = response.data?.data?.followers || response.data?.followers || [];
    // Map backend field names to frontend expectations
    return followers.map((f: any) => ({
        id: f.userId,
        nickname: f.name,
        profileImage: f.image,
        isFollowing: f.isFollowed
    }));
};

export const getFollowees = async (userId: number): Promise<Followee[]> => {
    const response = await client.get(`/users/${userId}/followee`); // Reverted to singular
    // Backend returns { message, data: { userId, following: [...] } }
    const following = response.data?.data?.following || response.data?.following || [];
    // Map backend field names to frontend expectations
    // Note: following list means these users are ALREADY being followed, so isFollowing = true
    return following.map((f: any) => ({
        id: f.userId,
        nickname: f.name,
        profileImage: f.image,
        isFollowing: true  // Always true for following list
    }));
};

export const followUser = async (userId: number, followeeId: number) => {
    const response = await client.post(`/users/${userId}/follower`, { followeeId }); // Reverted to singular
    return response.data;
};

export const unfollowUser = async (userId: number, followeeId: number) => {
    // Attempting delete with Path Parameter
    // If backend uses @PathVariable, this should work.
    // If backend uses @RequestBody, the previous one was correct but caused 500.
    // Seeing 500 usually implies server-side crash, maybe due to missing body or param.
    // Let's try path param which is more standard for DELETE.
    const response = await client.delete(`/users/${userId}/follower/${followeeId}`);
    return response.data;
};

// --- TIL Block Generation ---
/**
 * Generate a block from TIL content
 * @param communityId - The TIL ID (same as communityId in this context)
 */
export const generateBlockFromTIL = async (communityId: number) => {
    const response = await client.post('/blocks/generate/til', {
        communityId
    });
    return response.data;
};

// --- Project Block Generation ---
/**
 * Generate a block from Project content
 * @param projectId - The Project ID
 */
export const generateBlockFromProject = async (projectId: number) => {
    const response = await client.post('/blocks/generate/project', {
        projectId
    });
    return response.data;
};
