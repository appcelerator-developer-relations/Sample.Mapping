var path = require('path');
var child_process = require('child_process');

var FINGERPRINT = 'CC:E3:7F:08:FA:03:9C:88:07:BC:CB:AB:7B:88:61:F4:75:9D:47:9F;com.appcelerator.sample.mapping';
var KEY = 'AIzaSyBDuTWLdPRaKN2eTTQKVc-QDNdCS6RxzPM';

exports.init = function (logger, config, cli, nodeappc) {

	cli.on('build.pre.construct', function (build, next) {

		if (cli.argv.platform !== 'android') {
			return next();
		}

		var manifest = cli.tiapp.android.manifest;
		var match = manifest.match(/"com\.google\.android\.maps\.v2\.API_KEY" android:value="([^"]+)"/);

		if (!match) {
			logger.error(
				'Please make sure `tiapp.xml` has a valid Google API key\n\n' +
				'Guide:\nhttp://docs.appcelerator.com/platform/latest/#!/guide/Google_Maps_v2_for_Android-section-36739898_GoogleMapsv2forAndroid-ObtainandAddaGoogleAPIKey\n'
			);

			return process.exit(1);
		}

		var key = match[1];
		var keystore = cli.argv.keystore || path.join(cli.sdk.path, 'android', 'dev_keystore');
		var cmd = 'keytool -list -protected -keystore "' + keystore + '"';

		return child_process.exec(cmd, function (error, stdout, stderr) {
			var match, fingerprint;

			if (!error && stdout) {
				match = stdout.match(/\(SHA1\): (.+)$/m);

				if (match) {
					fingerprint = match[1] + ';' + cli.tiapp.id;
				}
			}

			if (fingerprint !== FINGERPRINT || key !== KEY) {
				error = 'Please replace `' + key + '` in `tiapp.xml` with a valid Google API Key for your keystore fingerprint.\n\n' +
					'Guide:\nhttp://docs.appcelerator.com/platform/latest/#!/guide/Google_Maps_v2_for_Android-section-36739898_GoogleMapsv2forAndroid-ObtainandAddaGoogleAPIKey\n';

				if (fingerprint) {
					error += '\nFingerprint:\n' + fingerprint + '\n';

					if (fingerprint === FINGERPRINT) {
						error += '\nKey:\n' + KEY + '\n';
					}
				}

				logger.error(error);

				return process.exit(1);
			}

			return next();

		});
	});
};
