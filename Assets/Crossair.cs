using UnityEngine;
using UnityEngine.EventSystems;
using Valve.VR;

public class Crossair : BaseInputModule
{
    public Camera m_Camera;
    public SteamVR_Input_Sources m_TargetSource;
    public SteamVR_Action_Boolean m_ClickAction;

    private GameObject m_CurrentGameObject = null;
    private PointerEventData m_Data = null;
    private ArticleUI articleUI;

    protected override void Awake()
    {
        base.Awake();
        articleUI = GameObject.Find("ArticleUI").GetComponent<ArticleUI>();
        m_Data = new PointerEventData(eventSystem);
    }

    public override void Process()
    {
        m_Data.Reset();
        m_Data.position = new Vector2(m_Camera.pixelWidth / 2, m_Camera.pixelHeight / 2);
        eventSystem.RaycastAll(m_Data, m_RaycastResultCache);
        m_Data.pointerCurrentRaycast = FindFirstRaycast(m_RaycastResultCache);
        m_CurrentGameObject = m_Data.pointerCurrentRaycast.gameObject;
        m_RaycastResultCache.Clear();
        HandlePointerExitAndEnter(m_Data, m_CurrentGameObject);
        if (m_ClickAction.GetStateDown(m_TargetSource))
            ProcessPress(m_Data);
        if (m_ClickAction.GetStateUp(m_TargetSource))
            ProcessRelease(m_Data);
    }

    public PointerEventData GetData()
    {
        return m_Data;
    }

    private void ProcessPress(PointerEventData data)
    {
        
    }

    private void ProcessRelease(PointerEventData data)
    {
        Debug.Log(data);
        Debug.Log(m_CurrentGameObject.name);
        if (articleUI.isActiveAndOpened())
        {
            cartHandler cartHandler = m_CurrentGameObject.GetComponent<cartHandler>();
            if (cartHandler != null)
                cartHandler.addToCart();
        }
    }
}