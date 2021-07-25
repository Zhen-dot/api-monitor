import jobs from '@/jobs';

export default async function load(): Promise<void> {
    await jobs();
}
