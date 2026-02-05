
import { SafeImageProcessor, RESIZE_CONFIG } from './SafeImageProcessor';

describe('SafeImageProcessor Gates', () => {
    const { LIMITS } = RESIZE_CONFIG;

    test('Classifies NORMAL correctly', async () => {
        const file = { size: 5 * 1024 * 1024 }; // 5MB
        // Mock probeDimensions to return small dims
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 1000, height: 1000 }); // 1MP

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('NORMAL');
    });

    test('Classifies WARNING by MP', async () => {
        const file = { size: 5 * 1024 * 1024 }; 
        // 35MP
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 7000, height: 5000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('WARNING');
    });

    test('Classifies WARNING by MB', async () => {
        const file = { size: 15 * 1024 * 1024 }; // 15MB
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 1000, height: 1000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('WARNING');
    });

    test('Classifies EXTREME by MP', async () => {
        const file = { size: 5 * 1024 * 1024 }; 
        // 50MP
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 10000, height: 5000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('EXTREME');
    });

    test('Classifies EXTREME by MB', async () => {
        const file = { size: 55 * 1024 * 1024 }; // 55MB (Under 60MB)
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 1000, height: 1000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('EXTREME');
    });

    test('Classifies REJECT by MP', async () => {
        const file = { size: 5 * 1024 * 1024 }; 
        // 90MP
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 9000, height: 10000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('REJECT');
    });

    test('Classifies REJECT by MB', async () => {
        const file = { size: 65 * 1024 * 1024 }; // 65MB (Over 60MB)
        jest.spyOn(SafeImageProcessor, 'probeDimensions').mockResolvedValue({ width: 1000, height: 1000 }); 

        const stats = await SafeImageProcessor.detectImageStats(file);
        expect(stats.tier).toBe('REJECT');
    });
});
