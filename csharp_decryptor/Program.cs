
using System.Security.Cryptography;
using System.Text;

string SK = "3ekQOpwiduajenflaknzjrekdlsnjbfdoeijoafsk!nda!w@akejnfnfd";
Rfc2898DeriveBytes deriveBytes = new Rfc2898DeriveBytes(SK, Encoding.ASCII.GetBytes("Ivan Medvedev"));
Aes aes = Aes.Create();
aes.Key = deriveBytes.GetBytes(0x20);
aes.IV = deriveBytes.GetBytes(0x10);

string encrypt(string plainText)
{
	ICryptoTransform encryptor = aes.CreateEncryptor();

	MemoryStream msEncrypt = new MemoryStream();
	CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);

	byte[] unicodeBytes = Encoding.Unicode.GetBytes(plainText);
	csEncrypt.Write(unicodeBytes);
	csEncrypt.Close();
	byte[] cipherBytes = msEncrypt.ToArray();
	string cipherText = Convert.ToBase64String(cipherBytes);
	return Convert.ToBase64String(Encoding.UTF8.GetBytes(cipherText));
}

string decrypt(string input)
{
	string cipherText = Encoding.UTF8.GetString(Convert.FromBase64String(input));
	byte[] cipherBytes = Convert.FromBase64String(cipherText);

	ICryptoTransform decryptor = aes.CreateDecryptor();
	MemoryStream msDecrypt = new MemoryStream();
	CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Write);

	csDecrypt.Write(cipherBytes);
	csDecrypt.Close();

	byte[] unicodeBytes = msDecrypt.ToArray();
	return Encoding.Unicode.GetString(unicodeBytes);
}

if (args.Length != 2) {
	throw new Exception(@"Invalid number of arguments. Should be [""encrypt"" / ""decrypt"", data].");
}

string mode = args[0];
string data = args[1];

switch(mode) 
{
  case "decrypt":
	Console.Write(decrypt(data));
    break;
  case "encrypt":
	Console.Write(encrypt(data));
    break;
  default: 
	throw new Exception("Invalid mode " + mode + ". Valid modes are encrypt and decrypt.");
}