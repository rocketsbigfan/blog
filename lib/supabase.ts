import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from '../types/supabase.type';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * 通用 Upsert 函数
 * @param {string} tableName - 表名
 * @param {object} where - 查询条件（用于确定是否存在记录）
 * @param {object} createData - 插入时使用的数据
 * @param {object} updateData - 更新时使用的数据
 * @param {function} callback - 操作完成后的回调函数，接收操作类型和结果
 */

type TableNames = Database['public']['Tables']
export async function upsertRecord<T extends keyof TableNames>(tableName: T, where: Partial<Tables<T>>, updateData: Partial<Tables<T>>, createData: Partial<Tables<T>>, callback: (operation: 'insert' | 'update' | 'error', data: any) => void) {
  try {
    // Step 1: 查询记录是否存在
    let query = supabase.from(tableName).select('*');
    for (const key in where) {

      query = query.eq(key, where[key] as any);
    }

    const { data: existingRecord, error: selectError } = await query.single();

    if (selectError && selectError.code !== 'PGRST116') {
      // 处理查询错误（排除“无记录”错误）
      console.error('Error querying record:', selectError);
      throw selectError;
    }

    if (existingRecord) {
      // Step 2: 如果记录存在，执行更新操作
      let updateQuery = supabase
        .from(tableName)
        .update(updateData as any);
        
      for (const key in where) {
        updateQuery = updateQuery.eq(key as any, where[key] as any);
      }

      const { data, error: updateError } = await updateQuery;
      if (updateError) {
        console.error('Error updating record:', updateError);
        throw updateError;
      }
      console.log(`Record in table "${tableName}" updated successfully.`);
      if (callback) callback('update', data); // 调用回调函数，传递操作类型和结果
    } else {
      // Step 3: 如果记录不存在，执行插入操作
      const { data, error: insertError } = await supabase.from(tableName).insert([createData as any]);
      if (insertError) {
        console.error('Error inserting record:', insertError);
        throw insertError;
      }
      console.log(`Record in table "${tableName}" created successfully.`);
      if (callback) callback('insert', data); // 调用回调函数，传递操作类型和结果
    }
  } catch (err) {
    console.error('Upsert operation failed:', err);
    if (callback) callback('error', err); // 在发生错误时调用回调函数
  }
}
