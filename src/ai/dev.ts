'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-social-media-post.ts';
import '@/ai/flows/enrich-contact-data.ts';
