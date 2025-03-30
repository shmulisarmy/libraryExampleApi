
public class Utils{



public static void displayObject(object obj){
    foreach (var property in obj.GetType().GetProperties()){
        Console.WriteLine($"{property.Name}: {property.GetValue(obj)}");
    }
}

public static void assert_equals(object values1, object values2){
    if (values1 != values2){
        throw new Exception($"{values1} != {values2}");
    }
}

public static string sixCharCode(){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = new char[6];
    for (int i = 0; i < 6; i++)
    {
        result[i] = chars[new Random().Next(chars.Length)];
    }
    return new string(result);
}

public static Dictionary<string, (object, DateTime)> cache = new Dictionary<string, (object, DateTime)>();

public static T GetOrCache<T>(string key, Func<T> func, int refreshEvery = 60 * 60 * 24){
    if (cache.ContainsKey(key)){
        var (value, lastUpdated) = cache[key];
        if (DateTime.Now < lastUpdated + TimeSpan.FromSeconds(refreshEvery)){
            return (T)value;
        }
    }
    var result = func();
    cache[key] = (result, DateTime.Now);
    return result;
}


}