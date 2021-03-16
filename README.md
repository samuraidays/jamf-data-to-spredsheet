# jamf-data-to-spredsheet
Jamf Proのコンピュータ情報をスプレッドシートに出力し、コンピュータインベントリとして使用する

# 使い方
1. JAMF URLに `https://XXXXXX.jamfcloud.com/JSSResource/` を入れる  
2. Jamfにこのコード用途のユーザを作成し、コンピュータ権限を付与する  
3. <ユーザ名>:<パスワード>にそのユーザとパスワードを入れる  
4. 必要な拡張属性を作成する

拡張属性は下記が必要です
必要ない拡張属性があればコードの方を変更してください
- Device Status : デバイスのステータス
- KeyboardLayout : キーボードの種類（JP / US）
- 2years : 購入日から2年後の日付
- 3years : 購入日から3年後の日付
