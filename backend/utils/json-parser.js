/**
 * Robust JSON parsing utility
 * Tries multiple strategies to parse JSON from Gemini responses
 */

function parseJsonRobust(text) {
    console.log('🔍 Attempting to parse JSON response...');
    console.log(`   Length: ${text.length} characters`);

    // Strategy 1: Direct parse (if Gemini returns clean JSON)
    try {
        const result = JSON.parse(text);
        console.log('✅ Strategy 1 (direct parse) succeeded');
        return result;
    } catch (e) {
        console.log('⚠️  Strategy 1 failed:', e.message);
        // Continue to next strategy
    }

    // Strategy 2: Remove markdown code blocks
    try {
        let cleaned = text;
        if (cleaned.includes('```json')) {
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            console.log('   Removed ```json blocks');
        } else if (cleaned.includes('```')) {
            cleaned = cleaned.replace(/```\n?/g, '');
            console.log('   Removed ``` blocks');
        }
        const result = JSON.parse(cleaned.trim());
        console.log('✅ Strategy 2 (markdown removal) succeeded');
        return result;
    } catch (e) {
        console.log('⚠️  Strategy 2 failed:', e.message);
        // Continue to next strategy
    }

    // Strategy 3: Extract JSON object using regex
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            console.log('   Found JSON object with regex');
            const result = JSON.parse(jsonMatch[0]);
            console.log('✅ Strategy 3 (regex extraction) succeeded');
            return result;
        }
    } catch (e) {
        console.log('⚠️  Strategy 3 failed:', e.message);
        // Continue to next strategy
    }

    // Strategy 4: Remove comments and try again
    try {
        let cleaned = text
            .replace(/\/\/.*$/gm, '') // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        const result = JSON.parse(cleaned.trim());
        console.log('✅ Strategy 4 (comment removal) succeeded');
        return result;
    } catch (e) {
        console.log('⚠️  Strategy 4 failed:', e.message);
        // Continue to next strategy
    }

    // Strategy 5: Fix common JSON errors
    try {
        let fixed = text
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
            .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double
            .trim();

        const result = JSON.parse(fixed);
        console.log('✅ Strategy 5 (error fixing) succeeded');
        return result;
    } catch (e) {
        console.log('⚠️  Strategy 5 failed:', e.message);
        // All strategies failed
    }

    // All strategies failed - log the problematic text
    console.error('\n❌ ALL PARSING STRATEGIES FAILED');
    console.error('First 500 characters of response:');
    console.error(text.substring(0, 500));
    console.error('\nLast 500 characters of response:');
    console.error(text.substring(Math.max(0, text.length - 500)));

    throw new Error(`All JSON parsing strategies failed. Response length: ${text.length} characters. Check server logs for details.`);
}

module.exports = { parseJsonRobust };
