import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usdxlzbwydbxcbdpcoae.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZHhsemJ3eWRieGNiZHBjb2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NDcxMzMsImV4cCI6MjA1NDEyMzEzM30.GY0vVw0WB34wf2FvSjrif8eHEbGcEyw4SSYglwhhBa0'; 
export const supabase = createClient(supabaseUrl, supabaseKey);