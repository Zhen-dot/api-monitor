import bot from '@/services/slack';

export default async function jobs(): Promise<void> {
    console.log('jobs');

    bot();
}
