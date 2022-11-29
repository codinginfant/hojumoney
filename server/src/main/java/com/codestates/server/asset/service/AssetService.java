package com.codestates.server.asset.service;

import com.codestates.server.asset.entity.Asset;
import com.codestates.server.asset.entity.Asset.AssetStatus;
import com.codestates.server.asset.repository.AssetRepository;
import com.codestates.server.exception.BusinessLogicException;
import com.codestates.server.exception.ExceptionCode;
import com.codestates.server.member.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class AssetService {

    private final AssetRepository repository;
    private final MemberService memberService;

    public AssetService(AssetRepository repository, MemberService memberService) {
        this.repository = repository;
        this.memberService = memberService;
    }

    @Transactional
    public Asset createAsset(Asset asset, long memberId) {
        asset.setMember(memberService.findVerifiedMember(memberId));// 포스트 하는 멤버 추가하는 로직 -> security 구현 되면 나중에
        return repository.save(asset);
    }
    @Transactional
    public Asset updateAsset(Asset asset, String strValue) { // asset은 Long타입. strValue는 String)
        Asset verifiedAsset = findVerifiedAsset(asset.getAssetId());

        Optional.ofNullable(asset.getAssetType())
            .ifPresent(assetType -> findVerifiedAsset(asset.getAssetId()).setAssetType(assetType));


        // string을 long으로 형변환
        long num = Long.parseLong(strValue.substring(1));
        long newValue = 0L;
        long oldValue = verifiedAsset.getAssetValue();

        if (strValue.charAt(0) == '-') {
            newValue = oldValue - num;
        }
        else if (strValue.charAt(0) == '+') {
            newValue = oldValue + num;
        }
        verifiedAsset.setAssetValue(newValue);  // 새로운 벨류로 업데이트
        return repository.save(verifiedAsset);

    }

    // 하나 찾기
    public Asset findAsset(long assetId) {
        return findVerifiedAsset(assetId);
    }

    // 전체 찾기
    public List<Asset> findAssets() {
        return new ArrayList<>(repository.findAll());
    }



    @Transactional
    public void deleteAsset(long assetId) {
        Asset verifiedAsset = findVerifiedAsset(assetId);
        verifiedAsset.setAssetStatus(AssetStatus.ASSET_DELETED);
        repository.delete(verifiedAsset);

    }

    public List<Asset> findAllPatched() {
        return repository.findAllPatched();
    }

//    public List<Asset> findAllTagAsset() {
//        return repository.findAllTagPost();
//    }

    public Asset findVerifiedAsset(long assetId) {
        Optional<Asset> optionalAsset = repository.findById(assetId);
        return optionalAsset.orElseThrow(
            () -> new BusinessLogicException(ExceptionCode.ASSET_NOT_FOUND));

    }

//    public Asset findVerifiedAsset(long assetId) {
//        Optional<Asset> optionalAsset = repository.findById(assetId);
//        Asset findAsset =
//            optionalAsset.orElseThrow(
//                () -> new BusinessLogicException(ExceptionCode.ASSET_NOT_FOUND)
//            );
//        return findAsset;
//    }

}
