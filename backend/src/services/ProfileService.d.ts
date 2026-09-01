interface ProfileIds {
    universityId?: string;
    companyId?: string;
}
declare class ProfileService {
    createProfile(role: string, orgName: string): Promise<ProfileIds>;
}
declare const _default: ProfileService;
export default _default;
//# sourceMappingURL=ProfileService.d.ts.map