(
var folder = thisProcess.nowExecutingPath.dirname+/+"outputs"+/+Date.localtime.stamp;
s.waitForBoot{
	var n_frames = 2000;

	[
		"Harker-DS-TenOboeMultiphonics-M",
		"Olencki-TenTromboneLongTones-M",
		"Tremblay-AaS-AcBassGuit-Melo-M",
		"Tremblay-AaS-VoiceQC-B2K-M"
	].do{
		arg stem;
		var audio_path = FluidFilesPath("%.wav".format(stem));

		var buf = Buffer.read(s,audio_path);
		var melbuf = Buffer(s);

		s.sync;

		FluidBufMelBands.processBlocking(s,buf,features:melbuf,normalize:0,action:{
			melbuf.loadToFloatArray(action:{
				arg melarray;

				fork({
					var fw, img;
					melarray = melarray.clump(melbuf.numChannels).flop.collect{arg arr; arr.resamp1(n_frames)}.flop;

					folder.mkdir;

					ArrayToCSV(melarray,folder+/+"%_melbands.csv".format(stem));

					fw = FluidWaveform(buf,bounds:Rect(0,0,1600,400));
					// s.sync;
					2.wait;
					img = Image.fromWindow(fw.win);
					// s.sync;
					2.wait;
					img.write(folder+/+"%.png".format(stem),"png",100);
					fw.close;

					buf.write(folder+/+"%.wav".format(stem));
				},AppClock);

			});
		});
	}
}
)